// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import Matter from 'matter-js';

document.addEventListener('DOMContentLoaded', () => {
  // Matter.jsのモジュールを読み込む
  const { Engine, Render, Bodies, World } = Matter;

  // エンジンを作成
  const engine = Engine.create();

  // レンダラーを作成
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 800,
      height: 600,
      wireframes: false
    }
  });

  // 物体を作成
  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
  // 楕円形に近い形状を作成するために多角形を使用
  const ellipse = Bodies.polygon(600, 200, 20, 40, {
    render: {
      fillStyle: 'blue'
    }
  });

  // ワールドに物体を追加
  World.add(engine.world, [ellipse, boxA, ground]);

  // レンダラーとエンジンを実行
  Render.run(render);
  Engine.run(engine);
});
