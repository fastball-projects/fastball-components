package dev.fastball.ui.components.table;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;
import dev.fastball.core.component.DownloadFile;
import dev.fastball.ui.components.table.param.TableSearchParam;

import java.io.*;
import java.nio.file.Files;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public interface SearchTable<T, S> extends Component, ExportableTable<T> {

    /**
     * 列表获取数据的接口
     *
     * @param search 用于搜索的条件
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    DataResult<T> loadData(TableSearchParam<S> search);

    @UIApi
    default DownloadFile exportData(TableSearchParam<S> search) throws IOException {
        File file = File.createTempFile("exportExcel", "xlsx");
        ExcelWriter excelWriter = buildExcelWriter(file);
        WriteSheet writeSheet = EasyExcel.writerSheet("导出").build();
        if (search == null) {
            excelWriter.write(loadData(null).getData(), writeSheet);
        } else {
            search.setCurrent(1L);
            DataResult<T> pageData = loadData(search);
            do {
                excelWriter.write(pageData.getData(), writeSheet);
                search.setCurrent(search.getCurrent() + 1);
            } while ((search.getCurrent() - 1) * search.getPageSize() < pageData.getTotal());
        }
        excelWriter.finish();
        return DownloadFile.builder().fileName("导出文件").contentType("application/vnd.ms-excel")
                .inputStream(Files.newInputStream(file.toPath())).build();
    }
}
