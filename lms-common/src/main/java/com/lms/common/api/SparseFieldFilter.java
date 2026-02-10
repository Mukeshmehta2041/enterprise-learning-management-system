package com.lms.common.api;

import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.springframework.http.converter.json.MappingJacksonValue;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Utility to support sparse fieldsets (field selection).
 */
public class SparseFieldFilter {

  public static MappingJacksonValue filter(Object data, String fields) {
    MappingJacksonValue wrapper = new MappingJacksonValue(data);

    if (fields != null && !fields.isBlank()) {
      Set<String> fieldSet = new HashSet<>(Arrays.asList(fields.split(",")));
      FilterProvider filters = new SimpleFilterProvider()
          .addFilter("sparseFilter", SimpleBeanPropertyFilter.filterOutAllExcept(fieldSet));
      wrapper.setFilters(filters);
    } else {
      // If no fields specified, allow all
      wrapper.setFilters(new SimpleFilterProvider()
          .addFilter("sparseFilter", SimpleBeanPropertyFilter.serializeAll()));
    }

    return wrapper;
  }
}
