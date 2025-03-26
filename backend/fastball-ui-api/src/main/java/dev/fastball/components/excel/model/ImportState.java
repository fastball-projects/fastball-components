package dev.fastball.components.excel.model;

import dev.fastball.core.annotation.DictionaryItem;

public enum ImportState {
    @DictionaryItem(label = "导入成功", color = "#00CC99")
    SUCCESS,
    @DictionaryItem(label = "部分成功", color = "#CC6600")
    PARTIAL_SUCCESS,
    @DictionaryItem(label = "导入失败", color = "#CC0000")
    FAIL,
    @DictionaryItem(label = "导入中", color = "#00CCFF")
    IMPORTING;
}
