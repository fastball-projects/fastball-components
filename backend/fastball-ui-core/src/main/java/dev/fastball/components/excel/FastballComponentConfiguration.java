package dev.fastball.components.excel;

import dev.fastball.core.intergration.storage.ObjectStorageService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FastballComponentConfiguration {

    @Bean
    public ExcelServiceImpl excelService(ObjectStorageService objectStorageService) {
        return new ExcelServiceImpl(objectStorageService);
    }
}
