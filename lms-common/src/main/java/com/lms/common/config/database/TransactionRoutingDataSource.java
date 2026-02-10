package com.lms.common.config.database;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.transaction.support.TransactionSynchronizationManager;

public class TransactionRoutingDataSource extends AbstractRoutingDataSource {

  @Override
  protected Object determineCurrentLookupKey() {
    if (TransactionSynchronizationManager.isActualTransactionActive() &&
        TransactionSynchronizationManager.isCurrentTransactionReadOnly()) {
      return DataSourceType.REPLICA;
    }
    return DataSourceType.PRIMARY;
  }
}
