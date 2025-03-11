package dev.fastball.components.basic.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/11
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ReferenceComponentConfig {

    String componentName();

    String npmPackage();

    String fromPath() default "";

    boolean defaultComponent() default true;
}
