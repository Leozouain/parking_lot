interface Car {
    name: string | undefined;
    plate: string | undefined;
    entry: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

    const calculateTime = (milliseconds: number) => {
        const min = Math.floor(milliseconds / 60000);
        const sec = Math.floor((milliseconds % 60000) / 1000);
        return `${min}m and ${sec}s`;
    }

    const patio = () => {
        const read = (): Car[] => {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }


        const add = (car: Car, saved?: boolean) => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${car.name}</td>
                <td>${car.plate}</td>
                <td>${car.entry}</td>
                <td>
                    <button id="delete" data-plate="${car.plate}">X</button>
                </td>
    `;
            row.querySelector("#delete")?.addEventListener("click", function () {
                remove(this.dataset.plate)
            })
            $("#patio")?.appendChild(row)

            saved ? save([...read(), car]) : null
        }


        const remove = (plate: string) => {
            const { entry, name } = read().find(car => car.plate === plate)
            const time = calculateTime(new Date().getTime() - new Date(entry).getTime());
            if (!confirm(`The car ${name} stayed for ${time}. Do you want to remove it?`)) {
                return
            }
            save(read().filter(car => car.plate !== plate))
            render()


        }
        const save = (cars: Car[]) => {
            localStorage.setItem("patio", JSON.stringify(cars))
        }
        const render = () => {
            $("#patio")!.innerHTML = ""
            const cars = read()
            if (cars.length) {
                cars.forEach((car) => add(car));
            }

        }
        return { add, remove, save, render };

    }
    patio().render();
    $("#register")?.addEventListener("click", () => {
        const name = $("#name")?.value
        const plate = $("#plate")?.value

        console.log("Registering:", { name, plate })

        if (!name || !plate) {
            alert("Both name and plate are required!")
            return
        }

        patio().add({ name, plate, entry: new Date().toISOString() }, true)

    });

})();