export type EmergencyInfo = {
  emergencyId: string;
  userName: string;
  userPhone: string;
  userAge: number;
  userAddress: string;
  userWeight: double;
  userHeight: double;
  emergencyTime: Date;
  strokeLevel?: string;
  emergencyLocation: {latitude: double; longitude: double};
};