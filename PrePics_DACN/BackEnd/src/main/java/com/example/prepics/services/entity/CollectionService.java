package com.example.prepics.services.entity;

import com.example.prepics.entity.Collection;
import com.example.prepics.interfaces.CRUDInterface;
import java.util.List;
import java.util.Optional;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface CollectionService extends CRUDInterface<Collection, Long> {

  Optional<List<Collection>> getUserCollection(String userId)
      throws ChangeSetPersister.NotFoundException;

  Optional<Collection> getUserCollectionByName(String userId, String collectionName)
      throws ChangeSetPersister.NotFoundException;
}