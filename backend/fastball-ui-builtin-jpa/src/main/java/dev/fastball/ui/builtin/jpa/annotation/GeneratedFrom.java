package dev.fastball.ui.builtin.jpa.annotation;

import java.lang.annotation.*;

/**
 * @author gengrong
 */
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.SOURCE)
public @interface GeneratedFrom {
    Class<?> value();
}
