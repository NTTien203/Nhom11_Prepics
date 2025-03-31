package com.example.prepics.repositories;

import com.example.prepics.entity.Followees;
import com.example.prepics.interfaces.CRUDInterface;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceContextType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.transaction.annotation.Transactional;

public class FolloweeRepository implements CRUDInterface<Followees, Long> {

  @PersistenceContext(unitName = "masterEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager masterEntityManager;

  @PersistenceContext(unitName = "slaveEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager slaveEntityManager;

  @Override
  @Transactional("masterTransactionManager")
  public Optional<List<Followees>> findAll(Class<Followees> clazz)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(masterEntityManager
        .createQuery("SELECT a FROM Followees a", Followees.class).getResultList());
  }

  @Override
  @Transactional("slaveTransactionManager")
  public Optional<Followees> findById(Class<Followees> clazz, Long id)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(slaveEntityManager.find(clazz, id));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Followees> create(Followees entity) {
    masterEntityManager.persist(entity);
    return Optional.ofNullable(entity);
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Followees> update(Followees entity) {
    return Optional.ofNullable(masterEntityManager.merge(entity));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Followees> delete(Long id) throws ChangeSetPersister.NotFoundException {
    Followees result = Optional.ofNullable(slaveEntityManager.find(Followees.class, id))
        .orElseThrow(ChangeSetPersister.NotFoundException::new);

    masterEntityManager.createQuery("DELETE FROM Followees WHERE id = :id")
        .setParameter("id", id)
        .executeUpdate();
    return Optional.ofNullable(result);
  }


  @Transactional("slaveTransactionManager")
  public Optional<Followees> findByUserIdAndFolloweeId(Class<Followees> clazz, String followerId,
      String followeeId) {
    String query = "SELECT a FROM Followees a WHERE a.userId = :followerId and a.followeeId = :followeeId";
    return slaveEntityManager.createQuery(query, clazz)
        .setParameter("followerId", followerId)
        .setParameter("followeeId", followeeId)
        .getResultStream()
        .findFirst();
  }
}