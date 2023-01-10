import { Displayable } from "../../types";


export const filterEnabled = (item: Displayable) => item.display !== 'Disabled'

export const filterVisibled = (item: Displayable) => item.display !== 'Disabled' && item.display !== 'Hidden'
