import React from "react";
import { vi } from "vitest";
import { mockNavigator } from "../src/Hooks/mocks/navigate";
import { mockParams } from "../src/Hooks/mocks/params";

// Create a mock useNavigate function with a mocked navigate property
export let useNavigate = () => {return mockNavigator};
export let useParams = () => {return mockParams}

export * from 'react-router-dom';
