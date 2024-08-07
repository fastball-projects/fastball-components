package dev.fastball.ui.components.metadata.form;

import dev.fastball.ui.components.form.config.FormFieldConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldConfigOverrideInfo {

    private FormFieldConfig config;
    private Map<String, FieldConfigOverrideInfo> subFieldsConfigMap;

}
