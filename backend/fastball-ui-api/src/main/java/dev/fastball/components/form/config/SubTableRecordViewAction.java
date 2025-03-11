package dev.fastball.components.form.config;

import dev.fastball.core.annotation.ViewAction;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface SubTableRecordViewAction {

    /**
     * SubTable 对应的字段路径
     *
     * @return 字段路径
     */
    String[] fields();

    ViewAction[] recordActions();
}
