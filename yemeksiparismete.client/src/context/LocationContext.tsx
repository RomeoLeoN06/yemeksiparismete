import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface City { id?: number; Id?: number; name?: string; Name?: string; }
interface District { id?: number; Id?: number; name?: string; Name?: string; cityId?: number; CityId?: number; }

interface LocationContextType {
  cities: City[];
  districts: District[];
  selectedCity: City | null;
  selectedDistrict: District | null;
  setSelectedCity: (city: City | null) => void;
  setSelectedDistrict: (district: District | null) => void;
  autoDetectLocation: () => Promise<void>;
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);

  // Uygulama açıldığında hafızadaki konumu yükle
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log("[SQL_DEBUG] Şehirler çekiliyor: /api/cities");
        const res = await fetch('/api/cities');
        if (!res.ok) {
          console.error(`[SQL_DEBUG] Şehirler çekilemedi: ${res.status}`);
          setCities([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const cityList = Array.isArray(data) ? data : [];
        setCities(cityList);

        const savedCity = localStorage.getItem('selectedCity');
        const savedDist = localStorage.getItem('selectedDistrict');

        if (savedCity) {
          const parsedCity = JSON.parse(savedCity);
          const cId = parsedCity.id ?? parsedCity.Id;
          
          const cityExists = cityList.some(c => (c.id ?? c.Id) === cId);
          if (cityExists) {
            setSelectedCity(parsedCity);
            console.log(`[SQL_DEBUG] Kayıtlı şehir bulundu: ${parsedCity.name ?? parsedCity.Name}`);
            
            const dRes = await fetch(`/api/cities/${cId}/districts`);
            if (dRes.ok) {
              const dData = await dRes.json();
              const dList = Array.isArray(dData) ? dData : [];
              setDistricts(dList);

              if (savedDist) {
                const parsedDist = JSON.parse(savedDist);
                const currentCityId = String(cId);
                const districtCityId = String(parsedDist.cityId ?? parsedDist.CityId);

                const distExists = dList.some(d => (d.id ?? d.Id) === (parsedDist.id ?? parsedDist.Id));
                if (districtCityId === currentCityId && distExists) {
                  setSelectedDistrict(parsedDist);
                  console.log(`[SQL_DEBUG] Kayıtlı ilçe doğrulandı: ${parsedDist.name ?? parsedDist.Name}`);
                } else {
                  console.warn("[SQL_DEBUG] İlçe geçersiz, temizleniyor.");
                  localStorage.removeItem('selectedDistrict');
                  setSelectedDistrict(null);
                }
              }
            }
          } else {
            console.warn("[SQL_DEBUG] Şehir listede yok, temizleniyor.");
            localStorage.removeItem('selectedCity');
            localStorage.removeItem('selectedDistrict');
            setSelectedCity(null);
            setSelectedDistrict(null);
          }
        } else {
          console.log("[SQL_DEBUG] Kayıtlı konum yok, seçim bekleniyor.");
        }
      } catch (err) {
        console.error("[SQL_DEBUG] Kritik Başlatma Hatası:", err);
      } finally {
        setLoading(false);
        console.log("[SQL_DEBUG] Konum yükleme tamamlandı.");
      }
    };

    loadInitialData();
  }, []);

  // Şehir değiştiğinde ilçeleri güncelle ve hafızaya al
  useEffect(() => {
    if (selectedCity) {
      const cId = selectedCity.id ?? selectedCity.Id;
      console.log(`[SQL_DEBUG] Districts for City ID: ${cId} are being fetched...`);
      fetch(`/api/cities/${cId}/districts`)
        .then(res => res.json())
        .then(data => {
          const districtList = Array.isArray(data) ? data : [];
          console.log("[SQL_DEBUG] Raw Districts from SQL:", districtList);
          setDistricts(districtList);

          // KRİTİK: Hafızadaki ilçenin yeni listede olup olmadığını doğrula (ID bazlı)
          if (selectedDistrict) {
            const currentId = selectedDistrict.id ?? selectedDistrict.Id;
            const exists = districtList.some(d => (d.id ?? d.Id) === currentId);
            if (!exists) {
              console.warn("[SQL_DEBUG] Bayat İlçe ID tespit edildi, temizleniyor...");
              setSelectedDistrict(null);
              localStorage.removeItem('selectedDistrict');
            }
          }
        });
    }
  }, [selectedCity, selectedDistrict]);

  // İlçe değiştiğinde hafızaya al
  useEffect(() => {
    if (selectedDistrict) {
      localStorage.setItem('selectedDistrict', JSON.stringify(selectedDistrict));
    }
  }, [selectedDistrict]);

  const handleSetSelectedCity = useCallback((city: City | null) => {
    setSelectedCity(city);
    if (city) {
      localStorage.setItem('selectedCity', JSON.stringify(city));
    } else {
      localStorage.removeItem('selectedCity');
    }
  }, []);

  const handleSetSelectedDistrict = useCallback((district: District | null) => {
    setSelectedDistrict(district);
    if (district) {
      localStorage.setItem('selectedDistrict', JSON.stringify(district));
    } else {
      localStorage.removeItem('selectedDistrict');
    }
  }, []);

  const autoDetectLocation = useCallback(async () => {
    setLoading(true);
    // Simulate Browser Geolocation delay
    await new Promise(r => setTimeout(r, 1500));
    const istanbul = cities.find(c => (c.name ?? c.Name) === 'İstanbul');
    if (istanbul) setSelectedCity(istanbul);
    setLoading(false);
  }, [cities]);

  return (
    <LocationContext.Provider value={{ 
      cities, districts, selectedCity, selectedDistrict, 
      setSelectedCity: handleSetSelectedCity, 
      setSelectedDistrict: handleSetSelectedDistrict, 
      autoDetectLocation, loading 
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
