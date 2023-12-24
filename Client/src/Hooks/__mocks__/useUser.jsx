import React from 'react';
import {vi} from 'vitest';
import { TEST_USER } from '../../FakeData';

export const useUser = vi.fn().mockReturnValue({
    user: TEST_USER,
    signupUser: vi.fn(),
    signinUser: vi.fn(),
    signoutUser: vi.fn(),
  })

export * from '../useUser';