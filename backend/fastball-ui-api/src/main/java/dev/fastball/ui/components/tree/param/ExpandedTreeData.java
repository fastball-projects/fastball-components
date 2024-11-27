package dev.fastball.ui.components.tree.param;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * @author Geng Rong
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpandedTreeData<T> {
    private List<T> data;
    private List<?> expandedKeys;
    private T selectedRecord;
}
