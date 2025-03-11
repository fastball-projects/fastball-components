package dev.fastball.components.excel;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FastballComponentConfiguration {

    @Bean
    public ExcelServiceImpl excelService() {
        return new ExcelServiceImpl();
    }
}
