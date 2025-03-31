package com.example.prepics.repositories;

import com.example.prepics.entity.Tag;
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
public class TagRepository implements CRUDInterface<Tag, Long> {

  @PersistenceContext(unitName = "masterEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager masterEntityManager;

  @PersistenceContext(unitName = "slaveEntityManagerFactory", type = PersistenceContextType.TRANSACTION)
  private EntityManager slaveEntityManager;

  @Override
  @Transactional("masterTransactionManager")
  public Optional<List<Tag>> findAll(Class<Tag> clazz) throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(masterEntityManager
        .createQuery("SELECT a FROM Tag a", Tag.class).getResultList());
  }

  @Transactional("masterTransactionManager")
  public Optional<List<Tag>> findAll(Class<Tag> clazz, int page, int size)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(masterEntityManager
        .createQuery("SELECT a FROM Tag a", Tag.class).setMaxResults(size)
        .setFirstResult((page - 1) * size)
        .getResultList());
  }

  @Override
  @Transactional("slaveTransactionManager")
  public Optional<Tag> findById(Class<Tag> clazz, Long id)
      throws ChangeSetPersister.NotFoundException {
    return Optional.ofNullable(slaveEntityManager.find(clazz, id));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Tag> create(Tag entity) {
    masterEntityManager.persist(entity);
    return Optional.ofNullable(entity);
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Tag> update(Tag entity) {
    return Optional.ofNullable(masterEntityManager.merge(entity));
  }

  @Override
  @Transactional("masterTransactionManager")
  public Optional<Tag> delete(Long id) throws ChangeSetPersister.NotFoundException {
    Tag result = Optional.ofNullable(slaveEntityManager.find(Tag.class, id))
        .orElseThrow(ChangeSetPersister.NotFoundException::new);

    masterEntityManager.createQuery("DELETE FROM Tag t WHERE t.id = :id")
        .setParameter("id", id)
        .executeUpdate();
    return Optional.ofNullable(result);
  }

  @Transactional("slaveTransactionManager")
  public Optional<Tag> findByNameIgnoreCase(String name) {
    String query = "SELECT t FROM Tag t WHERE LOWER(t.name) = LOWER(:name)";
    return slaveEntityManager.createQuery(query, Tag.class)
        .setParameter("name", name)
        .getResultStream()
        .findFirst();
  }

  @Transactional("slaveTransactionManager")
  public Optional<List<Tag>> findByNamesIgnoreCase(List<String> names) {
    if (names == null || names.isEmpty()) {
      return Optional.empty();
    }

    String query = "SELECT t FROM Tag t WHERE LOWER(t.name) IN :names";
    return Optional.ofNullable(slaveEntityManager.createQuery(query, Tag.class)
        .setParameter("names", names.stream()
            .map(String::toLowerCase)
            .toList())
        .getResultList());
  }
}