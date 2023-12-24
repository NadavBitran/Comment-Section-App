import * as mockCustomHooks from './__mocks__/Hooks'
import { vi } from 'vitest'

vi.mock('Hooks' , async () => {
    const actual = await vi.importActual('hooks')

    return {...actual , ...mockCustomHooks}
})
