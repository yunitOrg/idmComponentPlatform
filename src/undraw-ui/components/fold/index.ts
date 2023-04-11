import { withInstall } from '@/undraw-ui/util'
import foldVue from './fold.vue'

export type FoldInstance = InstanceType<typeof foldVue>
export const UFold = withInstall(foldVue)
export default UFold
