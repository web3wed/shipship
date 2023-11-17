import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Ceremony, Certificate, Connect, Landing } from '../../pages';

import { routes } from './routes';

export const LayoutRoutes: FC = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path={routes.landing.root} element={<Landing />} />
      <Route path={routes.connect.root} element={<Connect />} />
      <Route path={routes.ceremony.root} element={<Ceremony />} />
      <Route path={routes.certificate.root} element={<Certificate />} />
    </Routes>
  );
};
