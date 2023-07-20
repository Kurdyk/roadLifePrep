import { cleanup, waitFor, act } from "@testing-library/react";
import RoadComponent from "components/roads";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "@jest/globals";
import { BrowserRouter } from "react-router-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";


const server = setupServer(
    rest.get("http://localhost:5555/roads", (req, res, ctx) => {
        return res(
        ctx.json({
            roadList: [
            {
                id: "0",
                name: {city: "Paris", postalCode: "75009", streetName: "Avenue de la République"},
                wearScore: 50,
                roadPosition: [[0.5, 0.5], [-0.5, -0.5]],
            },
            {
                id: "1",
                name: {city: "Bordeaux", postalCode: "45083", streetName: "Boulevard du port"},
                wearScore: 82,
                roadPosition: [[-0.5, 0.5], [0.5, -0.5]],
            },
            {
                id: "2",
                name: {city: "Dijon", postalCode: "21110", streetName: "Place Darcy"},
                wearScore: 50,
                roadPosition: [[0.5, -0.5], [-0.5, 0.5]],
            },
            ],
        })
        );
    }),
    rest.get("http://localhost:5555/sensors", (req, res, ctx) => {
        return res(
        ctx.json({
            sensorList: [
            { id: "0", position: [0, 0], roadId: "0" },
            { id: "1", position: [1, 1], roadId: "0" },
            { id: "2", position: [2, 2], roadId: "1" },
            { id: "3", position: [3, 3], roadId: "1" },
            { id: "4", position: [4, 4], roadId: "1" },
            { id: "5", position: [5, 5], roadId: "2" },
            ],
        })
        );
    })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Road component test", () => {
    afterEach(() => {
        server.resetHandlers();
        cleanup();
    });

    test("Switch component", () => {
        render(<RoadComponent />, { wrapper: BrowserRouter });

        // First render
        var list: HTMLElement | null = screen.queryByRole("grid");
        expect(list).toBeInTheDocument();
        var map = screen.queryByRole("map");
        expect(map).not.toBeInTheDocument();

        // Check the switch
        const button = screen.getByRole("checkbox");
        act(() => {
            button.click();
        })

        list = screen.queryByRole("grid");
        expect(list).not.toBeInTheDocument();
        // eslint-disable-next-line testing-library/no-node-access
        map = document.getElementById('RoadsMap')
        expect(map).toBeInTheDocument();
    });

    test("List display", async () => {
        render(<RoadComponent />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByRole("grid")).toBeInTheDocument();
        });

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); // Allow component to update
        });

        // check list
        expect(screen.getAllByText("Avenue de la République 75009 Paris").length).toBe(2)
        expect(screen.getAllByText("Boulevard du port 45083 Bordeaux").length).toBe(1)
        expect(screen.queryAllByText("Place Darcy 21110 Dijon").length).toBe(0)
    });

});
