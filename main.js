$(document).ready(function () {
  const elOriginProvince = $("select#origin-province");
  const elOriginCity = $("select#origin-city");
  const elDestinationProvince = $("select#destination-province");
  const elDestinationCity = $("select#destination-city");
  const elInputWeight = $("input#weight");
  const elButtonCheck = $("button#check");

  $("#cost-details").hide();

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

  // ON CHANGED PROVINCE FIELD
  elOriginProvince.on("change", function () {
    const provinceId = $(this).val();

    getCityByProvince(elOriginCity, provinceId);
  });

  elDestinationProvince.on("change", function () {
    const provinceId = $(this).val();

    getCityByProvince(elDestinationCity, provinceId);
  });

  // ON PRESSED CEK ONGKIR BUTTON
  elButtonCheck.on("click", function (e) {
    e.preventDefault();
    $("#cost-details").hide();
    $("#cost-details table tbody").html("");

    if (
      elOriginProvince.val() &&
      elOriginCity.val() &&
      elDestinationProvince.val() &&
      elDestinationCity.val() &&
      elInputWeight.val() > 0
    ) {
      const data = {
        origin: elOriginCity.val(),
        destination: elDestinationCity.val(),
        weight: Number(elInputWeight.val()),
        courier: $("input[name=courier]:checked").val(),
      };

      fetch("http://127.0.0.1:3000/cost", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          const origin = json.origin_details;
          const destination = json.destination_details;
          const weight = json.query.weight / 1000;
          const results = json.results;
          console.log(json);

          $("#cost-details table caption").text(`
            ${origin.type} ${origin.city_name} - ${destination.type} ${destination.city_name} (${weight} kg)
          `);

          results[0].costs.map((data) => {
            $("#cost-details table tbody").append(`
              <tr>
                <th scope="row">${results[0].code.toUpperCase()}</th>
                <td>${data.service}</td>
                <td>${data.cost[0].etd} hari</td>
                <td class="text-right">${formatRupiah(data.cost[0].value)}</td>
              </tr>
            `);
          });

          $("#cost-details").show();
        })
        .catch((err) => console.error(error));
    } else {
      alert("Masukkan data dengan benar");
    }
  });

  function formatRupiah(value) {
    const stringReverse = value.toString().split("").reverse().join("");
    const splitThreeChar = stringReverse.match(/\d{1,3}/g);
    const result = splitThreeChar.join(".").split("").reverse().join("");
    return `Rp ${result}`;
  }
});
