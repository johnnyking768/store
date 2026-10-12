import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./context/StoreContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { Skeleton } from "./components/ui";
import Home from "./pages/Home";
import "./styles.css";
const Collection = lazy(() => import("./pages/Collection"));
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Compare = lazy(() => import("./pages/Compare"));
const NotFound = lazy(() => import("./pages/NotFound"));
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <StoreProvider>
          <ScrollToTop />
          <Suspense fallback={<Skeleton className="route-skeleton" />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="product/:slug" element={<Product />} />
                <Route path="compare" element={<Compare />} />
                {["shop", "brands", "accessories", "deals", "wishlist"].map(path => <Route key={path} path={path} element={<Shop />} />)}
                {[
                  "about",
                  "contact",
                  "delivery",
                  "warranty",
                  "faq",
                  "trade-in",
                  "terms",
                  "privacy",
                ].map((path) => (
                  <Route key={path} path={path} element={<Collection />} />
                ))}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </StoreProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
