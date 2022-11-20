import { Gender } from 'app/entities/enumerations/gender.model';

import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 24379,
  firstName: 'Erin',
  lastName: 'White',
  gender: Gender['FEMALE'],
  email: 'w8@BeqYVH.M4F1.tceO.5wgA3N.IqsW',
  phone: '763.650.5357 x6257',
  addressLine1: 'Awesome',
  city: 'Garfieldbury',
  country: 'Kazakhstan',
};

export const sampleWithPartialData: ICustomer = {
  id: 99746,
  firstName: 'Samantha',
  lastName: 'Quitzon',
  gender: Gender['FEMALE'],
  email: 'hd@H.i.8GyVN.0bZS',
  phone: '696.330.3981 x15017',
  addressLine1: 'withdrawal Oval Centralized',
  city: 'Jakaylaview',
  country: 'Barbados',
};

export const sampleWithFullData: ICustomer = {
  id: 11512,
  firstName: 'Bernhard',
  lastName: 'Sanford',
  gender: Gender['FEMALE'],
  email: '-iux@meQ.VeVd.Te9EX.8.UKFB',
  phone: '358.982.5102',
  addressLine1: 'transmitter',
  addressLine2: 'compelling up Car',
  city: 'East Juliana',
  country: 'Cocos (Keeling) Islands',
};

export const sampleWithNewData: NewCustomer = {
  firstName: 'Mustafa',
  lastName: 'Bayer',
  gender: Gender['MALE'],
  email: 'M@WW3vG.Csma7.7Ph.p.Pz.Jax_Ih.Gp',
  phone: '1-726-600-9964 x25413',
  addressLine1: 'Dinar Gibraltar',
  city: 'West Selina',
  country: 'Guadeloupe',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
