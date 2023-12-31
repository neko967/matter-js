// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import Matter from 'matter-js';


document.addEventListener('DOMContentLoaded', () => {
  // 使用モジュール
const Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
  Body = Matter.Body,
Bodies = Matter.Bodies,
Composite = Matter.Composite,
Composites = Matter.Composites,
  Vector = Matter.Vector,
Constraint = Matter.Constraint,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Events = Matter.Events;

// エンジンの生成
const engine = Engine.create();

// 物理演算canvasを挿入する要素
const canvas = $('#canvas-area')[0];

// レンダリングの設定
const render = Render.create({
element: canvas,
engine: engine,
options: {
  width: 800,
  height: 600,
}
});

// マウス、マウス制約を生成
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
mouse: mouse,
constraint: {
  render: {
    visible: false
  }
}
})

Composite.add(engine.world, mouseConstraint)
render.mouse = mouse

// レンダリングを実行
Render.run(render);

// エンジンを実行
Runner.run(engine);

//////////////////////////
$('body').append('<p class="body-counter">Number of balls : <span></span></p>');
$('body').append('<button>Clear</button>');

// ボール用Compositeを生成する【⑬】
const ballComposite = Composite.create();
Composite.add(engine.world, ballComposite);

// 静止オブジェクト（空中の床と画面外落下判定オブジェクト）【⑭】
const floor = Bodies.rectangle(400, 400, 500, 30, { isStatic: true });
const pit = Bodies.rectangle(400, 900, 50000, 30, { isStatic: true, label: 'pit' });
Composite.add(engine.world, [floor, pit]);

// クリックした位置に円を生成とballCompositeへの追加
Events.on(mouseConstraint, 'mousedown', e => {
  // ドラッグ中は生成しない
  if (mouseConstraint.body) { return }
  // 半径はランダム（10〜30）
  const min = 10;
  const max = 30;
  const radius = Math.random() * (max - min) + min;
  const ball = Bodies.circle(e.mouse.position.x, e.mouse.position.y, radius, { restitution: 0.5 });
  Composite.add(ballComposite, ball);
});

// Engineモジュールに対するイベント/衝突の発生を検知する【⑮】
Events.on(engine, 'collisionStart', e => {
  $.each(e.pairs, (i, pair) => {
    // 画面外落下判定オブジェクトに衝突したボールを削除する
    if (pair.bodyA.label === 'pit') {
      Composite.remove(ballComposite, pair.bodyB);
    }
  })
});

// Compositeへのオブジェクト追加を検知してボール総数の表示を更新する【⑯】
Events.on(ballComposite, 'afterAdd', e => {
  // Eventオブジェクトを直接参照してCompositeに含まれる全bodyを取得
  $('p.body-counter span').text(e.source.bodies.length);
});
// Compositeからのオブジェクト削除を検知してボール総数の表示を更新する【⑯】
Events.on(ballComposite, 'afterRemove', () => {
  // Composite#allBodies()を利用してCompositeに含まれる全bodyを取得
  $('p.body-counter span').text(Composite.allBodies(ballComposite).length);
});

$('button').on('click', () => {
  // ボールを一括削除する【⑰】
  Composite.clear(ballComposite);
  $('p.body-counter span').text(0);
});
});
