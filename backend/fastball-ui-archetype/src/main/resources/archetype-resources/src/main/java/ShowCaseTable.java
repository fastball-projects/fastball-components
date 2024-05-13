package $

import dev.fastball.core.annotation.UIComponent;
import dev.fastball.core.component.DataResult;
import dev.fastball.ui.components.table.Table;

import java.util.Arrays;

@UIComponent
public class ShowCaseTable implements Table<ShowCaseModel> {
    @Override
    public DataResult<ShowCaseModel> loadData() {
        return DataResult.build(Arrays.asList(new ShowCaseModel(1L, "张三"), new ShowCaseModel(2L, "李四")));
    }
}
