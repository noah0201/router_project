import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css'
import GlobalStyle from '@/GlobalStyle';

import Root, { loader as rootLoader, action as rootAction } from "@/routes/root";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import ErrorPage from '@/error-page';
import Contact, { loader as ContactLoader, action as contactAction } from '@/routes/contact';
import EditContact, { action as editAction } from "@/routes/edit";
import { action as destroyAction } from "@/routes/destroy";

import Index from '@/routes/index';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: ContactLoader,
            action: contactAction
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: ContactLoader,
            action: editAction
          },
          {
            path: "contacts/:contactId/destroy",
            errorElement: <div>Oops! There was an error.</div>,
            action: destroyAction,
          }
        ]
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
)
