package com.example.prepics.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigInteger;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comment", schema = "public")
public class Comment implements Serializable {

  @Serial
  private static final long serialVersionUID = 11234134523452345L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, name = "content")
  private String contentValue;

  @Column(name = "date_create")
  private BigInteger dateCreate;

  @Column(name = "user_id")
  private String userId;

  @Column(name = "content_id")
  private String contentId;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(insertable = false, updatable = false, name = "user_id")
  @JsonIgnoreProperties(
      value = {
          "applications",
          "contents",
          "collections",
          "followers",
          "followees",
          "user"
      }
  )
  private User user;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(insertable = false, updatable = false, name = "content_id")
  @JsonIgnore()
  private Content content;
}
