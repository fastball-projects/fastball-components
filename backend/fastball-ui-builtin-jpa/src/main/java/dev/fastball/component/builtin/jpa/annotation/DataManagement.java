package dev.fastball.component.builtin.jpa.annotation;

import java.lang.annotation.*;

@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.CLASS)
public @interface DataManagement {


    @Target(ElementType.FIELD)
    @Retention(RetentionPolicy.CLASS)
    @interface QueryIgnore {

    }
}
