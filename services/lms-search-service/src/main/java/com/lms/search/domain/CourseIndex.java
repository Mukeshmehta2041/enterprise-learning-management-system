package com.lms.search.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Document(indexName = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseIndex {
  @Id
  private String id;

  @Field(type = FieldType.Text, analyzer = "standard")
  private String title;

  @Field(type = FieldType.Text, analyzer = "standard")
  private String description;

  @Field(type = FieldType.Keyword)
  private String status;

  @Field(type = FieldType.Keyword)
  private String slug;

  @Field(type = FieldType.Text, analyzer = "standard")
  private String instructorName;

  @Field(type = FieldType.Keyword)
  private String category;

  @Field(type = FieldType.Double)
  private Double price;
}
