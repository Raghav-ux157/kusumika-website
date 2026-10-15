export type ShipmentStatus =
  | "Order Placed"
  | "Loom Assigned"
  | "Natural Dyeing"
  | "Quality Inspected"
  | "Ready for Dispatch"
  | "AWB Assigned"
  | "Pickup Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "RTO (Return to Origin)";

export interface TrackingCheckpoint {
  id: string;
  status: ShipmentStatus;
  activity: string;
  location: string;
  timestamp: string;
  courier: string;
  completed: boolean;
}

export interface CourierPartner {
  id: number;
  name: string;
  rate: number;
  etd: string;
  rating: number;
  codAvailable: boolean;
}

export interface ShiprocketShipment {
  orderId: string;
  shipmentId: number;
  awbCode: string;
  courierName: string;
  courierId?: number;
  status: ShipmentStatus;
  statusCode: number;
  pickupScheduledDate?: string;
  estimatedDeliveryDate?: string;
  trackingUrl: string;
  labelUrl?: string;
  manifestUrl?: string;
  isCod: boolean;
  codAmount: number;
  checkpoints: TrackingCheckpoint[];
}

export interface CreateShipmentPayload {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
    discount?: number;
    hsn?: string;
  }>;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentMode: "prepaid" | "partial_cod" | "full_cod";
  packageDimensions?: {
    lengthCm: number;
    breadthCm: number;
    heightCm: number;
    weightKg: number;
  };
}
