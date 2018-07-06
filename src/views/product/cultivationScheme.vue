<template>
  <div class="ktx-components-container">
    <div class="grid-content bg-purple-light">
      <div class="ktx-filter-block">
        <!-- <el-button v-if="$has('')" class="filter-item" type="primary" icon="edit" @click="handleCreate">添加</el-button> -->
        <el-input @keyup.enter.native="$handleFilter" v-model="schemeName" class="filter-item" placeholder="方案名称"></el-input>
        <!-- <el-input @keyup.enter.native="$handleFilter" v-model="variety" class="filter-item" placeholder="代养品种"></el-input>
        <el-input @keyup.enter.native="$handleFilter" v-model="productName" class="filter-item" placeholder="成品名称"></el-input> -->
        <el-select
              clearable
              class="filter-item"
              v-model="isSale"
              placeholder="上下架">
              <el-option v-for="(value, key) in isSaleCode" :key="key" :label="value" :value="key"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="$handleFilter">搜索</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column fixed class-name="ktx-operate" align="center" label="操作" width="190">
          <template slot-scope="scope">
            <el-button v-if="$has('')" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <!-- <el-button v-if="$has('') && scope.row.isSale === 1 && scope.row.schemeBatchNo === null" size="mini" @click="handleCreateIssue(scope.row)">发布认养</el-button> -->
            <!-- <el-button v-if="$has('') && scope.row.isSale === 1 && scope.row.schemeBatchNo !== null" size="mini" @click="handleAgainIssue(scope.row)">重新发布</el-button>
            <el-button v-if="$has('') && scope.row.isSale === 1" size="mini" @click="handleCancel(scope.row)">取消发布</el-button>
            <el-button v-if="$has('') && scope.row.isSale === 1" size="mini" @click="handleUsing(scope.row)">使用确认</el-button>
            <el-button v-if="$has('') && scope.row.isSale === 1" size="mini" @click="handleRenewal(scope.row)">发布续期</el-button> -->
            <el-button v-if="$has('')" size="mini" plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="cultivationSchemeNo" label="方案编号" width="180">
        </el-table-column>
        <!-- <el-table-column prop="schemeBatchNo" label="产品发布批次号" width="180">
        </el-table-column> -->
        <el-table-column prop="schemeName" label="方案名称" width="180">
        </el-table-column>
        <!-- <el-table-column prop="goodsName" label="所属产品名称" width="180">
        </el-table-column>
        <el-table-column prop="goodsType" label="所属产品类型" width="130">
          <template slot-scope="scope">
                <span>{{ goodsTypeCode[scope.row.goodsType] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="isSale" label="是否上架" width="130">
          <template slot-scope="scope">
                <span>{{ isSaleCode[scope.row.isSale] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="variety" label="代养品种" width="180">
        </el-table-column>
        <el-table-column prop="productName" label="成品名称" width="180">
        </el-table-column>
        <el-table-column prop="feed" label="养殖饲料" width="180">
        </el-table-column>
        <el-table-column prop="price" label="单位价格(元)" width="130">
          <template slot-scope="scope">
              <span>{{ scope.row.price | money }}</span>
            </template>
        </el-table-column> -->
        <!-- <el-table-column prop="validity" label="有效性" width="130">
          <template slot-scope="scope">
                <span>{{ validityCode[scope.row.validity] }}</span>
           </template>
        </el-table-column> -->
        <el-table-column prop="isSale" label="是否上架" width="130">
          <template slot-scope="scope">
                <span>{{ isSaleCode[scope.row.isSale] }}</span>
           </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="建档时间" width="170">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="ktx-page-block">
        <el-pagination @size-change="$handleSizeChange" @current-change="$handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 养殖方案添加 -->
    <el-dialog title="养殖方案添加" :visible.sync="dialogFormVisible">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="right" label-width="80px" style='width: 650px; margin-left:100px;'>
        <el-row :gutter="20">
        <el-col :span="12">
        <el-form-item label="所属养殖产品" prop="goodsNo" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            clearable
            filterable
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="handleGoodsChange">
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="temp.schemeName"></el-input>
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养品种" prop="variety">
              <el-input v-model="temp.variety"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input type="number" v-model="temp.price" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="养殖饲料" prop="feed">
              <el-input v-model="temp.feed"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品名称" prop="productName">
              <el-input v-model="temp.productName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成品数量" prop="productAmount">
              <el-input type="number" v-model="temp.productAmount" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品单位" prop="productUnit" :rules="[
                  { required: true, message: '请选择', trigger: 'change' }
                  ]">
              <el-select
                clearable
                filterable
                class="w-input"
                v-model="temp.productUnit"
                placeholder="成品单位">
                <el-option v-for="(value, key) in productUnitCode" :key="+key" :label="value" :value="+key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位重量" prop="unitWeight">
              <el-input v-model="temp.unitWeight" placeholder="KG"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浮动重量" prop="driftAmount">
              <el-input v-model="temp.driftAmount" placeholder="KG"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养总周期" prop="adoptionPeriod">
              <el-input type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
               v-model="temp.adoptionPeriod" placeholder="日"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <br>
        <!-- 养殖方案成长设定 -->
        <div class="lottery-content">
        <label class="box-1">阶段设置</label>
        <div class="box-2">
              <table class="table-view">
                <tr>
                  <td width="50">阶段</td>
                  <td width="100">阶段周期</td>
                  <td width="100">预计成熟度</td>
                  <td>预期描述</td>
                  <td
                    class="lottery-btn"
                    width="50"
                    title="添加"
                    @click="addGift(lottery.lotteryGifts)">
                    <i class="el-icon-plus"></i>
                  </td>
                </tr>
                <tr v-for="(gift, index) in filterActiveList(lottery.lotteryGifts || (lottery.lotteryGifts = []))" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.period" :title="gift.period" placeholder="日"></el-input>
                  </td>
                  <td>
                    <el-input type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.percentage" placeholder="%"></el-input>
                  </td>
                  <td><el-input type="textarea"  v-model="gift.description" placeholder="描述"></el-input></td>
                  <td class="lottery-btn"
                    title="删除"
                    @click="deleteGift(lottery.lotteryGifts, gift, index)">
                    <i class="el-icon-delete"></i>
                  </td>
                </tr>
              </table>
            </div>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoading">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <el-button v-else type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 养殖方案修改 -->
    <!-- <el-dialog title="养殖方案修改" :visible.sync="dialogFormVisibleUpdate" width="800px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 20px;">
        <el-row :gutter="20">
        <el-col :span="12">
        <el-form-item label="所属养殖产品" prop="goodsNo" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            disabled
            clearable
            filterable
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="handleGoodsChange">
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="temp.schemeName" disabled></el-input>
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养品种" prop="variety">
              <el-input v-model="temp.variety" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input type="number" v-model="temp.price" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="养殖饲料" prop="feed">
              <el-input v-model="temp.feed" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品名称" prop="productName">
              <el-input v-model="temp.productName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成品数量" prop="productAmount">
              <el-input type="number" v-model="temp.productAmount" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品单位" prop="productUnit" :rules="[
                  { required: true, message: '请选择', trigger: 'change' }
                  ]">
              <el-select
                clearable
                disabled
                filterable
                class="w-input"
                v-model="temp.productUnit"
                placeholder="成品单位">
                <el-option v-for="(value, key) in productUnitCode" :key="+key" :label="value" :value="+key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="浮动重量" prop="driftAmount">
              <el-input v-model="temp.driftAmount" placeholder="KG" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位重量(KG)" prop="unitWeight" v-if="temp.productUnit === 1">
              <el-input disabled v-model="temp.unitWeight" placeholder="KG"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养总周期(日)" prop="adoptionPeriod">
              <el-input disabled type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
               v-model="temp.adoptionPeriod" placeholder="日"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <br> -->
        <!-- 养殖方案成长设定 -->
        <!-- <div class="lottery-content">
        <label class="box-1">阶段设置</label>
        <div class="box-2">
              <table class="table-view">
                <tr>
                  <td width="50">阶段</td>
                  <td width="100">阶段周期</td>
                  <td width="100">预计成熟度</td>
                  <td>预期描述</td>
                  <td
                    class="lottery-btn"
                    width="50"
                    title="添加"
                    >
                    <i class="el-icon-plus"></i>
                  </td>
                </tr>
                <tr v-for="(gift, index) in filterActiveList(lottery.lotteryGifts || (lottery.lotteryGifts = []))" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input disabled type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.period" :title="gift.period" placeholder="日"></el-input>
                  </td>
                  <td>
                    <el-input disabled type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.percentage" placeholder="%"></el-input>
                  </td>
                  <td><el-input disabled type="textarea"  v-model="gift.description" placeholder="描述"></el-input></td>
                  <td class="lottery-btn"
                    title="删除"
                    >
                    <i class="el-icon-delete"></i>
                  </td>
                </tr>
              </table>
            </div>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingUpdate">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button v-if="dialogStatusUpdate=='update'" type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 养殖方案修改 -->
    <el-dialog title="养殖方案修改" :visible.sync="dialogFormVisibleUpdate" width="800px">
      <el-form class="small-space"
        :model="temp"
        :rules="rules"
        ref="editForm"
        label-position="left" label-width="120px" style="margin:0 20px;">
        <el-row :gutter="20">
        <el-col :span="12">
        <el-form-item label="所属养殖产品" prop="goodsNo" :rules="[
                  { required: true, message: '请选择' }
                  ]">
          <el-select
            clearable
            filterable
            class="w-input-235"
            v-model="temp.goodsNo"
            placeholder="请选择产品"
            @change="getGoodsTypeByNo"
            >
            <el-option v-for="goods in goodsList" :key="goods.goodsNo" :label="goods.goodsName" :value="goods.goodsNo"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="方案名称" prop="schemeName">
          <el-input v-model="temp.schemeName" ></el-input>
        </el-form-item>
        </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养品种" prop="variety">
              <el-input v-model="temp.variety" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格(元)" prop="price">
              <el-input type="number" v-model="temp.price" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="养殖饲料" prop="feed">
              <el-input v-model="temp.feed"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品名称" prop="productName">
              <el-input v-model="temp.productName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成品数量" prop="productAmount">
              <el-input type="number" v-model="temp.productAmount" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成品单位" prop="productUnit" :rules="[
                  { required: true, message: '请选择', trigger: 'change' }
                  ]">
              <el-select
                clearable
                disabled
                filterable
                class="w-input-235"
                v-model="temp.productUnit"
                placeholder="成品单位">
                <el-option v-for="(value, key) in productUnitCode" :key="+key" :label="value" :value="+key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="浮动重量" prop="driftAmount">
              <el-input v-model="temp.driftAmount" placeholder="KG" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位重量(KG)" prop="unitWeight"  v-if="temp.productUnit === 1">
              <el-input v-model="temp.unitWeight" placeholder="KG" onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="代养总周期(日)" prop="adoptionPeriod">
              <el-input type="number" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"
               v-model="temp.adoptionPeriod" placeholder="日"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <br>
        <!-- 养殖方案成长设定 -->
        <div class="lottery-content">
        <label class="box-1">阶段设置</label>
        <div class="box-2">
              <table class="table-view">
                <tr>
                  <td width="50">阶段</td>
                  <td width="100">阶段周期</td>
                  <td width="100">预计成熟度</td>
                  <td>预期描述</td>
                  <td
                    class="lottery-btn"
                    width="50"
                    title="添加"
                    @click="addGift(lottery.lotteryGifts)">
                    <i class="el-icon-plus"></i>
                  </td>
                </tr>
                <tr v-for="(gift, index) in filterActiveList(lottery.lotteryGifts || (lottery.lotteryGifts = []))" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <el-input type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.period" :title="gift.period" placeholder="日"></el-input>
                  </td>
                  <td>
                    <el-input type="number" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    v-model="gift.percentage" placeholder="%"></el-input>
                  </td>
                  <td><el-input type="textarea"  v-model="gift.description" placeholder="描述"></el-input></td>
                  <td class="lottery-btn"
                    title="删除"
                    @click="deleteGift(lottery.lotteryGifts, gift, index)">
                    <i class="el-icon-delete"></i>
                  </td>
                </tr>
              </table>
            </div>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-loading="formLoadingUpdate">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button v-if="dialogStatusUpdate=='update'" type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
const validityCode = {
  '1': '有效',
  '2': '无效'
}

const goodsTypeCode = {
  '1': '家禽',
  '2': '蔬菜',
  '3': '水果',
  '4': '鱼塘'
}

const productUnitCode = {
  '1': '只',
  '2': 'kg'
}

const isSaleCode = {
  '0': '下架',
  '1': '上架'
}
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          value: ''
        }]
      },
      listLoading: true,
      tableData: [],
      currentPage: 1,
      pageSize: this.$getPage(),
      total: 0,
      name: null,
      cashBackNo: null,

      goodsList: null,
      schemeName: null,

      validityCode,
      validity: null,
      goodsTypeCode,
      goodsType: null,
      productUnitCode,
      productUnit: null,
      isSaleCode,
      isSale: null,

      formLoadingIssue: false,
      dialogFormVisibleIssue: false,
      dialogStatusIssue: '',

      formLoadingUpdate: false,
      dialogFormVisibleUpdate: false,
      dialogStatusUpdate: '',

      formLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {},
      rules: {
        price: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '必填' }
        ],
        endTime: [
          { required: true, message: '必填' }
        ],
        count: [
          { required: true, message: '必填' }
        ],
        schemeName: [
          { required: true, message: '必填' }
        ],
        variety: [
          { required: true, message: '必填' }
        ],
        feed: [
          { required: true, message: '必填' }
        ],
        productName: [
          { required: true, message: '必填' }
        ],
        productAmount: [
          { required: true, message: '必填' }
        ],
        productUnit: [
          { required: true, message: '必填' }
        ],
        driftAmount: [
          { required: true, message: '必填' }
        ],
        adoptionPeriod: [
          { required: true, message: '必填' }
        ],
        sort: [
          { required: true, message: '必填' }
        ]
      },

      lottery: this.getInitData()
    }
  },
  methods: {
    $handleSizeChange(val) {
      this.$setPage(val)
      this.pageSize = val
      this.getTableList()
    },
    $handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList()
    },
    //  获取非土地产品
    async getGoodsOtherList() {
      if (this.goodsList != null) return
      const goodsRs = await this.$http.get('/goods/queryAllGoodsOtherList.json')
      this.goodsList = goodsRs.data.rows
    },
    async getTableList() {
      var params = {
        schemeName: this.schemeName,
        productName: this.productName,
        variety: this.variety,
        isSale: this.isSale || 99,
        page: this.currentPage,
        rows: this.pageSize
      }
      this.listLoading = true
      const response = await this.$http.post('/goodsCultivationScheme/queryByPage.json', params)
      this.tableData = response.data.rows
      this.total = response.data.total
      this.listLoading = false
    },
    handleCreate() {
      this.lottery = this.getInitData()
      this.getGoodsOtherList()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.formLoading = false
      this.$resetFields('editForm')
    },
    async create() {
      await this.$validate('editForm')

      this.formLoading = true
      const params = { ...this.temp }
      params.price = (this.temp.price * 100).toFixed(0)
      // 判断周期
      const rs = this.lottery.lotteryGifts
      if (rs.length === 0) {
        this.$tip('阶段设置不能为空!')
        return
      }
      let periodDay = 0
      for (let i = 0; i < rs.length; i++) {
        if (rs[i].period === null || rs[i].percentage === null || rs[i].description === null) {
          this.$tip('阶段设置不能为空!')
          return
        }
        const amount = parseInt(rs[i].period)
        periodDay += amount
      }
      if (periodDay > Number(params.adoptionPeriod)) {
        this.$tip('阶段总周期不能大于代养总周期!')
        return
      }
      // 判断成熟度 不能超过100%
      const rsPercentage = this.lottery.lotteryGifts
      let percentageDay = 0
      for (let i = 0; i < rsPercentage.length; i++) {
        const amounts = parseInt(rsPercentage[i].percentage)
        percentageDay += amounts
      }
      if (percentageDay > 100) {
        this.$tip('成熟度总和不能大于100%!')
        return
      }
      // 阶段成长
      const lottery = JSON.parse(JSON.stringify(this.lottery.lotteryGifts))
      params.paramss = JSON.stringify(lottery)
      const response = await this.$http.post('/goodsCultivationScheme/insertGoodsCultivationScheme.json', params)
      this.formLoading = false
      this.dialogFormVisible = false
      this.getTableList()
      this.$msg(response)
    },
    async handleUpdate(row) {
      // 获取该方案的养殖方案成长设定
      const cultivationSchemeId = row.id
      const response = await this.$http.post('/goodsCultivationScheme/getPlan.json', { cultivationSchemeId })
      this.lottery.lotteryGifts = response.data.rows
      this.getGoodsOtherList()
      this.dialogStatusUpdate = 'update'
      this.dialogFormVisibleUpdate = true
      this.formLoadingUpdate = false

      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.price = (this.temp.price / 100).toFixed(2)
    },
    async update() {
      await this.$validate('editForm')
      this.formLoadingUpdate = true
      const params = { ...this.temp }
      params.price = (this.temp.price * 100).toFixed(0)
      // 判断周期
      const rs = this.lottery.lotteryGifts
      if (rs.length === 0) {
        this.$tip('阶段设置不能为空!')
        this.formLoadingUpdate = false
        return false
      }
      let periodDay = 0
      for (let i = 0; i < rs.length; i++) {
        if (rs[i].period === null || rs[i].percentage === null || rs[i].description === null) {
          this.$tip('阶段设置不能为空!')
          this.formLoadingUpdate = false
          return false
        }
        const amount = parseInt(rs[i].period)
        periodDay += amount
      }
      if (periodDay > Number(params.adoptionPeriod)) {
        this.$tip('阶段总周期不能大于代养总周期!')
        this.formLoadingUpdate = false
        return false
      }
      // 判断成熟度 不能超过100%
      const rsPercentage = this.lottery.lotteryGifts
      for (let i = 0; i < rsPercentage.length; i++) {
        const amounts = parseInt(rsPercentage[i].percentage)
        if (amounts > 100) {
          this.$tip('成熟度不能大于100%!')
          this.formLoadingUpdate = false
          return false
        }
      }
      // 阶段成长
      const lottery = JSON.parse(JSON.stringify(this.lottery.lotteryGifts))
      params.paramss = JSON.stringify(lottery)
      const response = await this.$http.post('/goodsCultivationScheme/updateGoodsCultivationScheme.json', params)
      this.formLoadingUpdate = false
      this.dialogFormVisibleUpdate = false
      this.getTableList()
      this.$msg(response)
    },
    async getGoodsTypeByNo(goodsNo) {
      const response = await this.$http.post('/goods/getGoodsTypeByNo.json', { goodsNo })
      const rs = response.data.rows
      const goodsType = rs.goodsType
      if (goodsType === 1 || goodsType === 4) {
        this.temp.productUnit = 1
      } else {
        this.temp.productUnit = 2
      }
    },
    // 发布认领
    async handleCreateIssue(row) {
      await this.getGoodsOtherList()
      await this.handleGoodsChange(row.goodsNo)
      this.dialogStatusIssue = 'createIssue'
      this.dialogFormVisibleIssue = true
      this.formLoadingIssue = false

      await this.$resetFields('editForm')
      this.resetTemp()
      const temp = this.temp
      for (const key in temp) {
        temp[key] = row[key]
      }
      this.temp.price = (this.temp.price / 100).toFixed(2)
    },
    async createIssue() {
      await this.$validate('editForm')
      this.formLoading = true
      // const params = { ...this.temp }
      const params = {
        cultivationSchemeNo: this.temp.cultivationSchemeNo,
        goodsId: this.temp.goodsId,
        goodsNo: this.temp.goodsNo,
        goodsType: this.temp.goodsType,
        merchantId: this.temp.merchantId,
        schemeName: this.temp.schemeName,
        count: this.temp.count,
        price: (this.temp.price * 100).toFixed(0),
        startTime: this.$toDataStr(this.temp.startTime, '{y}-{m}-{d} {h}:{i}:{s}'),
        endTime: this.$toDataStr(this.temp.endTime, '{y}-{m}-{d} {h}:{i}:{s}')
      }
      if (!this.validateDate(params)) return
      const response = await this.$http.post('/gooodsSchemeBatch/insertGoodsCultivationSchemeBatch.json', params)
      this.formLoadingIssue = false
      this.dialogFormVisibleIssue = false
      this.getTableList()
      this.$msg(response)
    },
    async handleDelete(data) {
      if (data.schemeBatchNo !== null) {
        await this.$myConfirm('该方案已发布,是否删除?')
      } else {
        await this.$myConfirm('是否删除数据?')
      }
      const id = data.id
      const response = await this.$http.post('/goodsCultivationScheme/deleteById.json', { id })
      this.getTableList()
      this.$msg(response)
    },
    handleExport(row) {
      const params = {
        id: row.id,
        activityId: row.activityId
      }
      location.href = this.$baseApi() + '/goodsCultivationScheme/exportCashBackDetail.json?' +
                        this.$toQueryString(params)
    },
    // 时间
    startTimeChange(val) {
      const formatVal = this.formatDate(val)
      formatVal && (this.temp.startTime = this.dateStrToObj(formatVal))
    },
    endTimeChange(val) {
      const formatVal = this.formatDate(val)
      formatVal && (this.temp.endTime = this.dateStrToObj(formatVal))
    },
    formatDate(val) {
      if (!val) return

      let date = val
      if (!val.getTime) {
        date = this.dateStrToObj(val)
      }
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      if (this.checkIn1hour(date) && !(date.getMinutes() === 0 && date.getSeconds() === 0)) {
        hour = (hour + 1) % 24
      }
      hour = hour < 10 ? '0' + hour : hour

      const newDateStr = year + '-' + month + '-' + day + ' ' + hour + ':00:00'
      return newDateStr
    },
    dateStrToObj(val) {
      val = val.replace(/-/g, '/')
      return new Date(val)
    },
    checkIn1hour(date) {
      const currentData = new Date()
      if (date.getFullYear() === currentData.getFullYear() &&
          date.getMonth() === currentData.getMonth() &&
          date.getDate() === currentData.getDate() &&
          date.getHours() === currentData.getHours()) {
        return true
      }
      return false
    },
    validateDate(params) {
      if (params.startTime < this.formatDate(new Date())) {
        this.$tip('开始时间必须大于当前时间')
        return false
      }
      if (params.startTime > params.endTime) {
        this.$tip('结束时间必须大于开始时间')
        return false
      }
      return true
    },
    resetTemp() {
      this.temp = {
        id: null,
        schemeName: null,
        variety: null,
        goodsType: null,
        goodsNo: null,
        goodsName: null,
        cultivationSchemeNo: null,
        goodsId: null,
        merchantId: null,
        price: null,
        feed: null,

        paramss: null,

        period: null,
        stageLevel: 1,
        description: null,
        percentage: null,

        productName: null,
        productAmount: null,
        productUnit: null,
        unitWeight: null,
        driftAmount: null,
        sort: null,
        adoptionPeriod: null,
        startTime: null,
        endTime: null,
        count: null
      }
    },
    handleGoodsChange(goodsNo, isUpdate) {
      this.goodsList.forEach(item => {
        if (+item.goodsNo === goodsNo) {
          this.temp.goodsName = item.goodsName
        }
      })
    },
    getInitData() {
      return {
        lotteryGifts: [
          {
            id: null,
            period: null,
            percentage: null,
            description: null
          }
        ]
      }
    },
    addGift(list) {
      list.push(
        {
          id: null,
          period: null,
          percentage: null,
          description: null
        }
      )
    },
    deleteGift(list, gift, index) {
      list.splice(index, 1)
    },
    filterActiveList(list) {
      var rs = []
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        rs.push(item)
      }
      return rs
    }
  },
  watch: {
    isSale(val) {
      this.$handleFilter()
    }
  },
  mounted() {
    this.getTableList()
  }
}
</script>
<style lang="scss" scoped>
.lottery-content {
    display: flex;
    .box-1 {
      width: 100px;
      flex-shrink: 0;
    }
    .box-2 {
      flex-grow: 1;
    }
    .lottery-btn {
      text-align: center;
      cursor: pointer;
    }
    .round-box {
      margin: 32px 0;
      position: relative;
      .del-box {
        position: absolute;
        top: 50px;
        left: 65%;
      }
      .round-tip {
        line-height: 28px;
        color: #333;
      }
    }
    .round-box:nth-of-type(2) {
      margin-top: 8px;
    }
    .round-box:last-child {
      margin-bottom: 0px;
    }
  }
  .w-input-235 {
      width: 230px;
    }
</style>
