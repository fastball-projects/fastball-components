package dev.fastball.components.layout.metadata;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class LayoutPropsDeserializer extends StdDeserializer<LayoutProps> {

    static final String LAYOUT_TYPE = "layoutType";

    protected LayoutPropsDeserializer() {
        super(LayoutProps.class);
    }

    @Override
    public LayoutProps deserialize(JsonParser p, DeserializationContext context) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        LayoutType layoutType = LayoutType.valueOf(node.get(LAYOUT_TYPE).asText());
        Class<? extends LayoutProps> layoutPropsClass;
        if (layoutType == LayoutType.Grid) {
            layoutPropsClass = GridLayoutProps_AutoValue.class;
        } else if (layoutType == LayoutType.TopAndBottom) {
            layoutPropsClass = TopAndBottomLayoutProps_AutoValue.class;
        } else if (layoutType == LayoutType.LeftAndRight) {
            layoutPropsClass = LeftAndRightLayoutProps_AutoValue.class;
        } else if (layoutType == LayoutType.LeftAndTopBottom) {
            layoutPropsClass = LeftAndTopBottomLayoutProps_AutoValue.class;
        } else if (layoutType == LayoutType.Tabs) {
            layoutPropsClass = TabsLayoutProps_AutoValue.class;
        } else {
            throw new IllegalArgumentException("Unsupported layout type: " + layoutType);
        }
        return p.getCodec().treeToValue(node, layoutPropsClass);
    }
}
