package com.example.prepics.repositories;

import com.example.prepics.entity.InCols;
import com.example.prepics.interfaces.CRUDInterface;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceContextType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class InColsRepository implements CRUDInterface<InCols, Long> {

  @PersistenceContext(unitName = "masterEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager masterEntityManager;

  @PersistenceContext(unitName = "slaveEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager slaveEntityManager;

  @Override
  @Transactional("masterTransactionManager")
  public Optional<List<InCols>> findAll(Class<InCols> clazz)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(masterEntityManager
        .createQuery("SELECT a FROM InCols a", InCols.class).getResultList());
  }

  @Override
  @Transactional("slaveTransactionManager")
  public Optional<InCols> findById(Class<InCols> clazz, Long id)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(slaveEntityManager.find(clazz, id));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<InCols> create(InCols entity) {
    masterEntityManager.persist(entity);
    return Optional.ofNullable(entity);
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<InCols> update(InCols entity) {
    return Optional.ofNullable(masterEntityManager.merge(entity));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<InCols> delete(Long id) throws ChangeSetPersister.NotFoundException {
    InCols result = Optional.ofNullable(slaveEntityManager.find(InCols.class, id))
        .orElseThrow(ChangeSetPersister.NotFoundException::new);

    masterEntityManager.createQuery("DELETE FROM InCols WHERE id = :id")
        .setParameter("id", id)
        .executeUpdate();
    return Optional.ofNullable(result);
  }

  @Transactional("slaveTransactionManager")
  public Optional<InCols> findByContentIdAndCollectionId(String contentId, Long collectionId) {
    String query = "SELECT c FROM InCols c WHERE c.contentId = :contentId AND c.collectionId = :collectionId";
    return slaveEntityManager.createQuery(query, InCols.class)
        .setParameter("contentId", contentId)
        .setParameter("collectionId", collectionId)
        .getResultStream()
        .findFirst();
  }
}
