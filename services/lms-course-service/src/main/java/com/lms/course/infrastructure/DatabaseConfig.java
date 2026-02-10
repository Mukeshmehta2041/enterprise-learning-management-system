package com.lms.course.infrastructure;

import com.lms.common.config.database.DataSourceType;
import com.lms.common.config.database.TransactionRoutingDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DatabaseConfig {

  @Bean
  @ConfigurationProperties("spring.datasource.primary")
  public DataSourceProperties primaryDataSourceProperties() {
    return new DataSourceProperties();
  }

  @Bean
  @ConfigurationProperties("spring.datasource.replica")
  public DataSourceProperties replicaDataSourceProperties() {
    return new DataSourceProperties();
  }

  @Bean
  public DataSource primaryDataSource() {
    return primaryDataSourceProperties().initializeDataSourceBuilder().build();
  }

  @Bean
  public DataSource replicaDataSource() {
    return replicaDataSourceProperties().initializeDataSourceBuilder().build();
  }

  @Bean
  @Primary
  public DataSource dataSource() {
    TransactionRoutingDataSource routingDataSource = new TransactionRoutingDataSource();

    Map<Object, Object> dataSourceMap = new HashMap<>();
    dataSourceMap.put(DataSourceType.PRIMARY, primaryDataSource());
    dataSourceMap.put(DataSourceType.REPLICA, replicaDataSource());

    routingDataSource.setTargetDataSources(dataSourceMap);
    routingDataSource.setDefaultTargetDataSource(primaryDataSource());
    routingDataSource.afterPropertiesSet();

    // Use LazyConnectionDataSourceProxy to delay connection acquisition until
    // needed
    // This allows the routing to work based on the transaction type set in the
    // TransactionManager
    return new LazyConnectionDataSourceProxy(routingDataSource);
  }
}
