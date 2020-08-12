$(document).ready(function () {
  const elOriginProvince = $("select#origin-province");
  const elOriginCity = $("select#origin-city");
  const elDestinationProvince = $("select#destination-province");
  const elDestinationCity = $("select#destination-city");

  // GET PROVINCES
  async function getProvinces() {
    try {
      const res = await fetch("http://127.0.0.1:3000/province");
      const json = await res.json();

      if (json.status.code === 200) {
        const provinces = json.results;

        provinces.map((province) => {
          elOriginProvince.append(
            `<option value="${province.province_id}">${province.province}</option>`
          );
          elDestinationProvince.append(
            `<option value="${province.province_id}">${province.province}</option>`
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  getProvinces();

  // GET CITY BY PROVINCE_ID
  async function getCityByProvince(el, provinceId) {
    el.html(`<option value="" selected disabled>Pilih Kota</option>`);

    try {
      const res = await fetch(
        `http://127.0.0.1:3000/city?province=${provinceId}`
      );
      const json = await res.json();

      if (json.status.code === 200) {
        const cities = json.results;

        cities.map((city) => {
          el.append(
            `<option value="${city.city_id}">${city.type} ${city.city_name}</option>`
          );
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ON PROVINCE CHANGED
  elOriginProvince.on("change", function () {
    const provinceId = $(this).val();

    getCityByProvince(elOriginCity, provinceId);
  });

  elDestinationProvince.on("change", function () {
    const provinceId = $(this).val();

    getCityByProvince(elDestinationCity, provinceId);
  });
});
