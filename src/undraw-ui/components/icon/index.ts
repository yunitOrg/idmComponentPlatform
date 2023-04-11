import { withInstall } from '@/undraw-ui/util'
import iconVue from './icon.vue'

export type IconInstance = InstanceType<typeof iconVue>
export const UIcon = withInstall(iconVue)
export default UIcon
