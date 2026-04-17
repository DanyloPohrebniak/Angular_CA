import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import * as d3 from 'd3';

interface TeamStats {
  name: string;
  for: number;
  against: number;
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  filteredResults: TeamStats[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getResults().subscribe(matches => {
      this.filteredResults = this.calculateForAgainst(matches);
      setTimeout(() => this.createChart(), 100);
    });
  }

  calculateForAgainst(matches: any[]): TeamStats[] {
    const stats: { [key: string]: TeamStats } = {};

    matches.forEach(m => {
      if (!stats[m.hteam]) stats[m.hteam] = { name: m.hteam, for: 0, against: 0 };
      if (!stats[m.ateam]) stats[m.ateam] = { name: m.ateam, for: 0, against: 0 };

      stats[m.hteam].for += Number(m.hteamtotal || 0);
      stats[m.ateam].for += Number(m.ateamtotal || 0);
      stats[m.hteam].against += Number(m.ateamtotal || 0);
      stats[m.ateam].against += Number(m.hteamtotal || 0);
    });

    // alphabet sort
    return Object.values(stats).sort((a, b) => a.name.localeCompare(b.name));
  }

  createChart(): void {
    const data = this.filteredResults;
    if (!data || data.length === 0) return;

    const element = document.getElementById('chart-div');
    if (!element) return;
    element.innerHTML = ''; 

    const margin = { top: 40, right: 20, bottom: 40, left: 20 };
    const width = Math.max(800, data.length * 45) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const baseline = height / 2; 

    const svg = d3.select('#chart-div')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxScore = d3.max(data, d => Math.max(d.for, d.against)) || 100;

    // x
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    // y
    const y = d3.scaleLinear()
      .domain([0, maxScore])
      .range([0, height / 2 - 20]); 

    // blue
    svg.selectAll('.bar-for')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name)!)
      .attr('y', d => baseline - y(d.for))
      .attr('width', x.bandwidth())
      .attr('height', d => y(d.for))
      .attr('fill', '#4a90e2');

    // red
    svg.selectAll('.bar-against')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name)!)
      .attr('y', baseline)
      .attr('width', x.bandwidth())
      .attr('height', d => y(d.against))
      .attr('fill', '#a30000');

    // team's name
    svg.selectAll('.team-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', baseline + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => d.name.substring(0, 2).toUpperCase());

    // scores top
    svg.selectAll('.text-for')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', d => baseline - y(d.for) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .text(d => d.for);

    // scores bottom
    svg.selectAll('.text-against')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => x(d.name)! + x.bandwidth() / 2)
      .attr('y', d => baseline + y(d.against) + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .text(d => d.against);
  }
}