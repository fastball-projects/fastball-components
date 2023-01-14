package dev.fastball.ui.components.form;

import dev.fastball.core.component.Component;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/11
 */
public interface StepsForm {

    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @interface Config {
        Step[] steps();
    }

    @Target({})
    @Retention(RetentionPolicy.RUNTIME)
    @interface Step {
        String title();

        String description() default "";

        Class<? extends Component> component();
    }
}
