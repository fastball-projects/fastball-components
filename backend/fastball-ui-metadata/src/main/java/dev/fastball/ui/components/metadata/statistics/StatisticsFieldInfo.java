package dev.fastball.ui.components.metadata.statistics;

import lombok.Data;


@Data
public class StatisticsFieldInfo {
    private String name;
    private String title;
    private String color;
    private int precision;
    private String prefix;
    private String suffix;
}
