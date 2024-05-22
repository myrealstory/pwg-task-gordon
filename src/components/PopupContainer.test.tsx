import React from "react";
import { render, fireEvent, waitFor,screen } from "@testing-library/react";
import { PopupContainer } from "./PopupContainer";
import "@testing-library/jest-dom/";

describe("PopupContainer", () => {
  let mockTriggerModal: jest.Mock;
  let mockData: any[];

  beforeEach(() => {
    mockTriggerModal = jest.fn();
    mockData = [
      { id: 1, title: "Test Post 1", body: "Test Body 1", tags: ["history", "american"] },
      { id: 2, title: "Test Post 2", body: "Test Body 2", tags: ["science", "fantasy"] },
    ];
  });

  it("should display validation errors when required fields are empty", () => {
    const { getByText } = render(
      <PopupContainer
        modModal={{ type: "add", show: true }}
        modal={{ show: false, message: "", type: ""}}
        triggerModal={mockTriggerModal}
        data={mockData}
      />
    );

    const addButton = getByText("Add");
    fireEvent.click(addButton);

    expect(getByText("Title is required")).toBeInTheDocument();
    expect(getByText("Body is required")).toBeInTheDocument();
    expect(getByText("tags was required")).toBeInTheDocument();
  });

  it("should call triggerModal with correct arguments on successful form submission", async () => {
    const { getByLabelText, getByText } = render(
      <PopupContainer
        modModal={{ type: "add", show: true, }}
        modal={{ show: false, message: "", type: ""}}
        triggerModal={mockTriggerModal}
        data={[]}
      />
    );

    fireEvent.change(getByLabelText("Title"), { target: { value: "New Title" } });
    fireEvent.change(getByLabelText("Content"), { target: { value: "New Content" } });
    
    const select = getByLabelText("Tags");
    fireEvent.change(select, { target: { value: "fantasy" } });

    const addButton = getByText("Add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockTriggerModal).toHaveBeenCalledWith("add", true);
    });
    console.log("mockTriggerModal", mockTriggerModal);
  });

  it("should handle tag selection correctly", () => {
    render(
      <PopupContainer
        modModal={{ type: "add", show: true }}
        modal={{ show: false, message: "", type: ""}}
        triggerModal={mockTriggerModal}
        data={mockData}
      />
    );

    // 找到select元素
    const select = screen.getByRole("combobox", { name: /tags/i });

    // 触发select变化
    fireEvent.change(select, { target: { value: "tag1" } });

    // 验证第一个tag按钮是否渲染
    const selectedTag1 = screen.getByRole("button", { name: /tag1/i });
    expect(selectedTag1).toBeInTheDocument();

    // 触发select变化
    fireEvent.change(select, { target: { value: "tag2" } });

    // 验证第二个tag按钮是否渲染
    const selectedTag2 = screen.getByRole("button", { name: /tag2/i });
    expect(selectedTag2).toBeInTheDocument();
  });
});