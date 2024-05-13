package dev.fastball.ui.components.table;


import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;

/**
 * @author gr@fastball.dev
 * @since 2022/12/30
 */
@AutoService(value = ComponentCompiler.class)
public class SearchTableCompiler extends AbstractSearchTableCompiler<SearchTable<?, ?>> {
}
