"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { useDragControls } from "framer-motion";
import { Point } from "./point";
import { api } from "libs";
import { toast } from "sonner";
import { revalidateData } from "../actions";

type Level = {
  name: string | null;
  id: string;
  segmentA: string | null;
  segmentB: string | null;
  segmentC: string | null;
  segmentD: string | null;
  segmentE: string | null;
  points: {
    id: string;
    levelId: string;
    x: number;
    y: number;
  }[];
};

type LevelSelectorProps = {
  levels: Array<Level>;
};

export function LevelSelector({ levels }: LevelSelectorProps) {
  const [levelId, setLevelId] = useState<string>();
  const [levelName, setLevelName] = useState("");

  const [x, setX] = useState<number | "">(0);
  const [y, setY] = useState<number | "">(0);

  const [points, setPoints] = useState<Array<[number, number]>>([]);

  const controls = useDragControls();

  const containerRef = useRef<HTMLElement>(null);

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    controls.start(e);
  }

  return (
    <section className="flex flex-col space-y-2 px-4 grow">
      {/* Allows user to select and input name for the level section */}
      <Input
        className="w-48"
        value={levelName}
        placeholder="Level Name"
        onChange={(e) => setLevelName(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <Select
          value={levelId}
          disabled={levels.length === 0}
          onValueChange={(value) =>
            levels.find((level) => {
              if (level.id === value) {
                setLevelId(value);
                setPoints(level.points.map(({ x, y }) => [x, y]));
              }
            })
          }
        >
          <SelectTrigger className="w-64">
            <SelectValue
              placeholder={
                levels.length > 0 ? "Select a level" : "No level to select"
              }
            />
          </SelectTrigger>
          <SelectContent className="w-64">
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="w-24"
          onClick={async () => {
            if (!levelName)
              return void toast.error("Level name is required", {
                position: "top-right",
              });
            const { error } = await api.save.post({
              name: levelName,
              points: points,
            });

            if (error)
              return void toast.error("Failed to save level", {
                position: "top-right",
              });

            toast.success("Level saved successfully", {
              position: "top-right",
            });

            setLevelName("");

            await revalidateData();
          }}
        >
          Save
        </Button>
      </div>
      {/* Allows user to select segments for the level */}
      <div className="flex items-center justify-start gap-x-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="segment-a">A.</Label>
          <Select>
            <SelectTrigger id="segment-a" className="w-44">
              <SelectValue placeholder="Select a segment A" />
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="segment 4">Segment 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="segment-b">B.</Label>
          <Select>
            <SelectTrigger id="segment-b" className="w-44">
              <SelectValue placeholder="Select a segment B" />
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="segment 2">Segment 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="segment-c">C.</Label>
          <Select>
            <SelectTrigger id="segment-c" className="w-44">
              <SelectValue placeholder="Select a segment C" />
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="segment 6">Segment 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="segment-d">D.</Label>
          <Select>
            <SelectTrigger id="segment-d" className="w-44">
              <SelectValue placeholder="Select a segment D" />
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="segment 5">Segment 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="segment-e">E.</Label>
          <Select>
            <SelectTrigger id="segment-e" className="w-44">
              <SelectValue placeholder="Select a segment E" />
            </SelectTrigger>
            <SelectContent className="w-44">
              <SelectItem value="segment 1">Segment 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full flex flex-row h-full py-2 gap-x-4">
        <nav className="text-center border rounded-md flex flex-col h-full w-64 border-black">
          <p>sidebar</p>
        </nav>
        <div className="flex w-full flex-col space-y-4">
          <div className="flex w-full flex-row gap-x-4 items-center">
            <p>My main app area here</p>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Current Segment" />
              </SelectTrigger>
              <SelectContent className="w-48">
                <SelectItem value="segment 4">Segment 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* User can place boxes on the coordinate grid with the 2 input boxes on the right and they are able to drag and move them around */}
          <div className="flex items-start gap-x-8">
            <main
              ref={containerRef}
              className="shrink-0 relative w-[36rem] h-[32rem] bg-slate-50 rounded-xl"
            >
              {points.map(([x, y], index) => (
                <Point
                  key={index}
                  x={x}
                  y={y}
                  points={points}
                  index={index}
                  container={containerRef}
                  controls={controls}
                  setPoints={(points) => setPoints(points)}
                  startDrag={startDrag}
                />
              ))}
            </main>
            <div className="flex items-end space-x-2">
              <div className="space-y-2">
                <Label htmlFor="X">X</Label>
                <Input
                  id="X"
                  value={x}
                  className="w-36"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) return setX("");

                    if (isNaN(+value)) return;

                    setX(+value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Y">Y</Label>
                <Input
                  id="Y"
                  value={y}
                  className="w-36"
                  onChange={(e) => {
                    const value = e.target.value;

                    if (!value) return setY("");

                    if (isNaN(+value)) return;

                    setY(+value);
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  setPoints([...points, [x === "" ? 0 : x, y === "" ? 0 : y]]);

                  setX("");
                  setY("");
                }}
              >
                Position
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
