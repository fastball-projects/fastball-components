package dev.fastball.components.layout.config;

import dev.fastball.core.component.Component;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/30
 */
@Target({})
@Retention(RetentionPolicy.RUNTIME)
public @interface TabItem {
    String label();

    Class<? extends Component> component();
}
