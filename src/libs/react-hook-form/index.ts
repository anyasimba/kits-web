import * as _ from './react-hook-form'
Object.assign(global, _)

declare global {
    const useForm: typeof _.useForm
}
