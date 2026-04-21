import { BaseService } from './BaseService.js';
import { ENDPOINTS } from '@/api/endpoints.js';

export class LocationsService extends BaseService {
  constructor() {
    super(ENDPOINTS.LOCATIONS);
  }

  provinces() {
    return this.client.get(`${this.endpoint}/provinces`);
  }

  districts(provinceId) {
    return this.client.get(`${this.endpoint}/districts`, { params: { province_id: provinceId } });
  }

  neighborhoods(districtId) {
    return this.client.get(`${this.endpoint}/neighborhoods`, {
      params: { district_id: districtId },
    });
  }
}

export const locationsService = new LocationsService();
