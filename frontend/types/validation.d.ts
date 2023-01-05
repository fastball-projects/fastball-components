import { ReactElement } from 'react'

export interface ValidationRule {
    required?: boolean;
    len?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    warningOnly?: boolean;
    whitespace?: boolean;
    validateTrigger?: string | string[];
    message?: string | ReactElement;
}