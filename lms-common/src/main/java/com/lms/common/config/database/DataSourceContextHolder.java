package com.lms.common.config.database;

public class DataSourceContextHolder {
  private static final ThreadLocal<DataSourceType> CONTEXT = new ThreadLocal<>();

  public static void setDataSourceType(DataSourceType type) {
    CONTEXT.set(type);
  }

  public static DataSourceType getDataSourceType() {
    return CONTEXT.get();
  }

  public static void clear() {
    CONTEXT.remove();
  }
}
