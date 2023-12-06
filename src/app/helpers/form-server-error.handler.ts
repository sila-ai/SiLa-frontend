import { FormGroup } from "@angular/forms"

export class FormServerErrorHandler {

    setFormErrors(form: FormGroup, err: any) {
        const properties = err.error.message
        for (let p of properties) {
            const error_messages = Object.keys(p.constraints).map(key => { return p.constraints[key] })

            const message = error_messages.toString()
            let new_message = ''
            for (let [i, v] of [...message].entries()) {
                if (message.charAt(i - 1) === ',' || i === 0) {
                    new_message += `&bull; ${message.charAt(i).toUpperCase()}`
                } else {
                    new_message += v
                }
            }

            form.get(p.property).setErrors({
                'server': new_message.replace(',', '<br>')
            })
        }
        form.updateValueAndValidity()
    }

}