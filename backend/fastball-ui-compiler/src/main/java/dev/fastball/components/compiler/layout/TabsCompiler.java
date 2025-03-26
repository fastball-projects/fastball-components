package dev.fastball.components.compiler.layout;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.components.layout.TabsLayout;
import dev.fastball.components.layout.config.*;
import dev.fastball.components.layout.metadata.*;
import dev.fastball.meta.utils.JsonUtils;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static dev.fastball.compile.utils.ElementCompileUtils.getReferencedComponentInfo;

/**
 * @author gr@fastball.dev
 * @since 2022/12/19
 */
@AutoService(value = ComponentCompiler.class)
public class TabsCompiler extends AbstractComponentCompiler<TabsLayout, TabsLayoutProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballTabs";

    @Override
    protected TabsLayoutProps_AutoValue buildProps(CompileContext compileContext) {
        TabsConfig tabsLayout = compileContext.getComponentElement().getAnnotation(TabsConfig.class);
        if (tabsLayout != null) {
            TabsLayoutProps_AutoValue props = new TabsLayoutProps_AutoValue();
            props.defaultActiveTab(tabsLayout.defaultActiveTab());
            props.keepAlive(tabsLayout.keepAlive());
            List<TabItemProps_AutoValue> items = Arrays.stream(tabsLayout.items()).map(item -> {
                TabItemProps_AutoValue tabItemProps = new TabItemProps_AutoValue();
                tabItemProps.label(item.label());
                String componentInput = item.componentInput();
                if (StringUtils.hasLength(componentInput)) {
                    try {
                        Map<String, Object> input = JsonUtils.fromJson(componentInput, Map.class);
                        tabItemProps.componentInput(input);
                    } catch (JsonProcessingException e) {
                        String component = compileContext.getComponentElement().getQualifiedName().toString();
                        throw new CompilerException("@TabItem.input must be json format, the component: " + component);
                    }
                }
                tabItemProps.component(getReferencedComponentInfo(props, item::component));
                return tabItemProps;
            }).collect(Collectors.toList());
            props.items(items);
            return props;
        }
        String message = String.format("TabsLayout Component [%s] must add annotation @TabsConfig", compileContext.getComponentElement().getQualifiedName());
        throw new CompilerException(message);
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
