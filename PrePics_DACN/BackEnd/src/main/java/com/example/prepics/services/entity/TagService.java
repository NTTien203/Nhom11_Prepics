package com.example.prepics.services.entity;

import com.example.prepics.entity.Tag;
import com.example.prepics.interfaces.CRUDInterface;
import jakarta.persistence.EntityExistsException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface TagService extends CRUDInterface<Tag, Long> {

  Optional<Tag> findByName(Class<Tag> clazz, String name)
      throws ChangeSetPersister.NotFoundException;

  Optional<Tag> create(String tagName)
      throws EntityExistsException, ChangeSetPersister.NotFoundException;

  Optional<List<Tag>> findAll(Class<Tag> clazz, int page, int size)
      throws ChangeSetPersister.NotFoundException;
}